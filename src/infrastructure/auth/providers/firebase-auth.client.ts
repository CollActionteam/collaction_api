import { FirebaseApp } from 'firebase/app';
import {
    Auth,
    AuthSettings,
    CompleteFn,
    Config,
    EmulatorConfig,
    ErrorFn,
    NextOrObserver,
    Persistence,
    Unsubscribe,
    User,
} from 'firebase/auth';

export abstract class FirebaseAuthClient implements Auth {
    app: FirebaseApp;
    name: string;
    config: Config;
    languageCode: string | null;
    tenantId: string | null;
    settings: AuthSettings;
    currentUser: User | null;
    emulatorConfig: EmulatorConfig | null;
    abstract setPersistence(persistence: Persistence): Promise<void>;
    abstract onAuthStateChanged(
        nextOrObserver: NextOrObserver<User | null>,
        error?: ErrorFn | undefined,
        completed?: CompleteFn | undefined,
    ): Unsubscribe;
    abstract beforeAuthStateChanged(callback: (user: User | null) => void | Promise<void>, onAbort?: (() => void) | undefined): Unsubscribe;
    abstract onIdTokenChanged(
        nextOrObserver: NextOrObserver<User | null>,
        error?: ErrorFn | undefined,
        completed?: CompleteFn | undefined,
    ): Unsubscribe;
    abstract updateCurrentUser(user: User | null): Promise<void>;
    abstract useDeviceLanguage(): void;
    abstract signOut(): Promise<void>;
}
