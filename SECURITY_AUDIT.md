# Аудит безопасности роутов inpalm_backend

## 🔴 КРИТИЧЕСКИЕ УЯЗВИМОСТИ

### 1. **Отсутствие аутентификации на открытых знйных роутах**
**Риск**: Высокий  
**Файлы**: `src/user/user.controller.ts`, `src/publication/publication.controller.ts`

```typescript
// ❌ Открыто для всех
@Post()  // POST /users - создание пользователя
@Get()   // GET /users - получение всех пользователей  
@Get(':id')  // GET /users/:id - получение по ID
@Put(':id')  // PUT /users/:id - обновление
@Delete(':id')  // DELETE /users/:id - удаление
@Get('count')  // GET /users/count - количество пользователей
```

**Рекомендация**: Добавить `@UseGuards(AuthGuard)` на все роуты кроме регистрации/логина

---

### 2. **Path Traversal в загрузке файлов**
**Риск**: Высокий  
**Файлы**: `src/media/media.controller.ts`

```typescript
// ❌ УЯЗВИВО! author берется из req.body без валидации
const author = req.body.author as string;  // Может быть "../../../"
const uploadPath = `./photos/${author}`;  // ПУТЬ МОЖЕТ БЫТЬ ИЗМЕНЕН!
mkdirSync(uploadPath, { recursive: true });
```

**Атака**: User может загрузить файл в `/photos/../../../etc/` или другие директории

**Рекомендация**:
```typescript
// ✅ ПРАВИЛЬНО
const authorId = req.user.id;  // Из JWT токена
const sanitized = authorId.replace(/[^a-zA-Z0-9_-]/g, '');
const uploadPath = `./photos/${sanitized}`;
```

---

### 3. **Недостаточная валидация JWT токена**
**Риск**: Высокий  
**Файлы**: `src/auth/auth.middleware.ts`, `src/user/user.controller.ts`, `src/publication/publication.controller.ts`

```typescript
// ❌ УЯЗВИВО! Только decode, без verify
const decoded = this.jwtService.decode<...>(token!);

// Не проверяется подпись, срок действия, алгоритм!
// Атакующий может подделать любой токен
```

**Рекомендация**: Использовать `verify` вместо `decode`
```typescript
// ✅ ПРАВИЛЬНО
const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
```

---

### 4. **Отсутствие защиты от несанкционированного доступа к данным**
**Риск**: Высокий  
**Файлы**: `src/user/user.controller.ts`, `src/publication/publication.controller.ts`

```typescript
// ❌ Любой пользователь может обновить данные другого пользователя
@Put(':id')
async update(@Param('id') id: string, @Body() updateUserDto: UpdateUser) {
  return this.usersService.update(id, updateUserDto);  // id может быть чужой!
}

// ❌ Любой может удалить публикацию другого пользователя
@Delete(':id')
async remove(@Param('id') id: string) {
  return await this.publicationService.remove(id);  // Нет проверки автора!
}
```

**Рекомендация**: Проверять владельца ресурса
```typescript
@Put(':id')
async update(@Param('id') id: string, @Req() req: Request) {
  const userId = req.user.id;  // Из JWT
  if (userId !== id) throw new ForbiddenException();
  return this.usersService.update(id, updateUserDto);
}
```

---

### 5. **Раскрытие информации в error messages**
**Риск**: Средний  
**Примеры**:
```typescript
// ❌ Раскрывает ID пользователя
throw new NotFoundException(`Пользователь с таким ID ${id} не найден`);

// ❌ Раскрывает наличие email в системе
throw new NotFoundException('Пользовтель не найден');
```

**Рекомендация**: Использовать генерические сообщения
```typescript
throw new NotFoundException('Запрашиваемый ресурс не найден');
```

---

### 6. **NoSQL Injection потенциал в публикациях**
**Риск**: Средний  
**Файлы**: `src/publication/publication.service.ts`

```typescript
// Возможно уязвиво если status может быть объектом
const publications = await this.publicationModel.find({
  status: ['published'],  // Но несмотря на это, массив может быть эксплуатирован
});
```

---

### 7. **Отсутствие Rate Limiting**
**Риск**: Средний  
**Файлы**: Все роуты

Нет защиты от brute force атак на:
- `/auth/login` - перебор пароля
- `/auth/register` - spam регистраций
- `/users` - перебор ID

**Рекомендация**: Добавить `@nestjs/throttler`

---

### 8. **Открытая раздача файлов без проверок**
**Риск**: Средний  
**Файлы**: `src/main.ts`

```typescript
// ❌ Статические файлы открыты для всех
app.use('/photos', express.static(...));
app.use('/videos', express.static(...));

// Пользователь может перечислить все файлы: GET /photos/
```

**Рекомендация**: Требовать авторизацию для доступа к файлам или использовать токены

---

### 9. **Отсутствие валидации входных данных**
**Риск**: Средний  
**Файлы**: `src/media/media.controller.ts`

```typescript
@Body() body: { author: string }  // Нет@IsString(), @IsNotEmpty() и т.д.
```

---

### 10. **Проблемы с загрузкой видео**
**Риск**: Средний  
**Файлы**: `src/media/media.controller.ts`

```typescript
// ❌ Сообщение об ошибке неправильное
if (!file.originalname.match(/\.(mp4)$/)) {
  return callback(new Error('Only image files are allowed!'), false);  // Говорит "image" для видео!
}
```

---

## 🟡 СРЕДНИЕ УЯЗВИМОСТИ

### 11. **Отсутствие CORS настроек**
- Нет `app.enableCors()` или явной конфигурации
- Может привести к CSRF атакам

### 12. **Недостаточная валидация MongoDB ID**
- Нет проверки что ID имеет корректный формат ObjectId

### 13. **JWT без expiry check**
- Хотя JWT генерируется с expiry, при decode без verify срок не проверяется

### 14. **Отсутствие логирования**
- Нет логирования попыток несанкционированного доступа

---

## ✅ РЕКОМЕНДАЦИИ ПО ПРИОРИТЕТАМ

### 1️⃣ КРИТИЧНЫЕ (Исправить немедленно):
- [ ] Добавить `@UseGuards(AuthGuard)` на все защищённые роуты
- [ ] Исправить Path Traversal в загрузке файлов
- [ ] Заменить `decode` на `verify` для JWT

### 2️⃣ ВАЖНЫЕ (Очень важно):
- [ ] Добавить проверку владельца ресурса (авторизацию)
- [ ] Добавить валидацию входных данных через DTO и decorators
- [ ] Убрать раскрытие информации из ошибок

### 3️⃣ РЕКОМЕНДУЕМЫЕ (Желательно):
- [ ] Добавить Rate Limiting
- [ ] Настроить CORS
- [ ] Добавить валидацию MongoDB ObjectId
- [ ] Добавить логирование
- [ ] Защитить статические файлы

---

## 📋 ПРИМЕРЫ ИСПРАВЛЕНИЙ

### Пример 1: Добавить Guard на роуты
```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))  // ✅ Добавить это
export class UserController {
  @Post()
  create(@Body() createUser: CreateUser) { ... }
  
  // Но при этом исключить login/register:
}
```

### Пример 2: Проверка владельца
```typescript
@Put(':id')
async update(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUser,
  @Req() req: Request
) {
  const userId = req.user.id;
  if (userId !== id) {
    throw new ForbiddenException('У вас нет доступа к этому ресурсу');
  }
  return this.usersService.update(id, updateUserDto);
}
```

### Пример 3: Исправить Path Traversal
```typescript
// ❌ БЫЛО
const author = req.body.author as string;

// ✅ СТАЛО
const author = req.user.id;  // Из JWT токена
const sanitized = author.replace(/[^a-zA-Z0-9_-]/g, '');
const uploadPath = `./photos/${sanitized}`;
```

---

Generated: 2026-04-03
