import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-service-account.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

    if (!privateKey) {
      throw new Error(
        'FIREBASE_PRIVATE_KEY is not defined in environment variables',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: privateKey,
      }),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });
  }

  getAuth() {
    return admin.auth();
  }
}
