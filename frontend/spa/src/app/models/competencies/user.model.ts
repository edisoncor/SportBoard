export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: 'Coach' | 'Player';
    birth_date: Date;
    nationality: string;
    gender: string;
    created_at: Date;
}
