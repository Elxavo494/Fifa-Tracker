export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          created_at: string
          name: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          user_id?: string
        }
      }
      matches: {
        Row: {
          id: string
          created_at: string
          date: string
          team1_player1: string
          team1_player2: string
          team2_player1: string
          team2_player2: string
          team1_score: number
          team2_score: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          team1_player1: string
          team1_player2: string
          team2_player1: string
          team2_player2: string
          team1_score: number
          team2_score: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          team1_player1?: string
          team1_player2?: string
          team2_player1?: string
          team2_player2?: string
          team1_score?: number
          team2_score?: number
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
    }
  }
}