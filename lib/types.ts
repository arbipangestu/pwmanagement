// Types for database entities
export interface User {
    id: number;
    name: string | null;
    email: string;
    // password is omitted for security in general usage
}

export interface Application {
    id: number;
    user_id: number;
    name: string;
    url: string | null;
    created_at: Date;
}

export interface Credential {
    id: number;
    application_id: number;
    username: string;
    password: string; // Encrypted or plain depending on context
    created_at: Date;
}
