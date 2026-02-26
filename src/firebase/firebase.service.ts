import { Injectable, OnModuleInit } from '@nestjs/common';
import admin from 'firebase-admin';
import * as firebaseServiceAccount from '../../firebase-service-account.json' with { type: 'json' };

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const firebaseService = firebaseServiceAccount.default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const privateKey = firebaseService.private_key.replace(/\\n/g, '\n');

    if (!privateKey) {
      throw new Error(
        'FIREBASE_PRIVATE_KEY is not defined in environment variables',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        projectId: firebaseService.project_id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        clientEmail: firebaseService.client_email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        privateKey: privateKey,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      storageBucket: `${firebaseService.project_id}.appspot.com`,
    });
  }

  getAuth() {
    return admin.auth();
  }
}
