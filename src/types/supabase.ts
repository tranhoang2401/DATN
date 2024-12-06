export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      advancedtraining: {
        Row: {
          code: string | null
          date: number | null
          description: string | null
          id: string
          name: string | null
          project: string | null
          trainingform: string | null
        }
        Insert: {
          code?: string | null
          date?: number | null
          description?: string | null
          id?: string
          name?: string | null
          project?: string | null
          trainingform?: string | null
        }
        Update: {
          code?: string | null
          date?: number | null
          description?: string | null
          id?: string
          name?: string | null
          project?: string | null
          trainingform?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advancedtraining_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "staffs"
            referencedColumns: ["code"]
          },
        ]
      }
      assessprofessionalstandards: {
        Row: {
          code: string | null
          criteria: string | null
          evaluationcontent: string | null
          evaluationlevel: string | null
          id: string
          proof: string | null
        }
        Insert: {
          code?: string | null
          criteria?: string | null
          evaluationcontent?: string | null
          evaluationlevel?: string | null
          id?: string
          proof?: string | null
        }
        Update: {
          code?: string | null
          criteria?: string | null
          evaluationcontent?: string | null
          evaluationlevel?: string | null
          id?: string
          proof?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_assess_code"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "staffs"
            referencedColumns: ["code"]
          },
        ]
      }
      discipline: {
        Row: {
          code: string | null
          decisioncode: string | null
          decisiondate: number | null
          disciplinereason: string | null
          disciplinetype: string | null
          id: string
        }
        Insert: {
          code?: string | null
          decisioncode?: string | null
          decisiondate?: number | null
          disciplinereason?: string | null
          disciplinetype?: string | null
          id?: string
        }
        Update: {
          code?: string | null
          decisioncode?: string | null
          decisiondate?: number | null
          disciplinereason?: string | null
          disciplinetype?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discipline_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "staffs"
            referencedColumns: ["code"]
          },
        ]
      }
      facilities: {
        Row: {
          classnumber: number | null
          functionroom: boolean | null
          id: string
          numberstaffrooms: number | null
          otherfacilities: Json | null
          projector: boolean | null
          roomnumber: number | null
          school_code: string | null
          tablenumber: number | null
        }
        Insert: {
          classnumber?: number | null
          functionroom?: boolean | null
          id?: string
          numberstaffrooms?: number | null
          otherfacilities?: Json | null
          projector?: boolean | null
          roomnumber?: number | null
          school_code?: string | null
          tablenumber?: number | null
        }
        Update: {
          classnumber?: number | null
          functionroom?: boolean | null
          id?: string
          numberstaffrooms?: number | null
          otherfacilities?: Json | null
          projector?: boolean | null
          roomnumber?: number | null
          school_code?: string | null
          tablenumber?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_school_code_fkey"
            columns: ["school_code"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_code"]
          },
        ]
      }
      healthy: {
        Row: {
          bmi: number | null
          bmievaluation: string | null
          canswim: boolean | null
          code: string | null
          eyedisease: string | null
          height: number | null
          id: string
          semesterhealth: string | null
          weight: number | null
        }
        Insert: {
          bmi?: number | null
          bmievaluation?: string | null
          canswim?: boolean | null
          code?: string | null
          eyedisease?: string | null
          height?: number | null
          id?: string
          semesterhealth?: string | null
          weight?: number | null
        }
        Update: {
          bmi?: number | null
          bmievaluation?: string | null
          canswim?: boolean | null
          code?: string | null
          eyedisease?: string | null
          height?: number | null
          id?: string
          semesterhealth?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "healthy_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["code"]
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          commune: string | null
          district: string | null
          email: string | null
          has_party_committee: boolean | null
          id: string
          international_school: boolean | null
          minimum_quality_level: boolean | null
          national_standard_level: string | null
          phone_number: string | null
          principal_name: string | null
          principal_phone: string | null
          quality_assurance: string | null
          region: string | null
          school_category: string | null
          school_code: string | null
          school_name: string
          school_type: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          commune?: string | null
          district?: string | null
          email?: string | null
          has_party_committee?: boolean | null
          id?: string
          international_school?: boolean | null
          minimum_quality_level?: boolean | null
          national_standard_level?: string | null
          phone_number?: string | null
          principal_name?: string | null
          principal_phone?: string | null
          quality_assurance?: string | null
          region?: string | null
          school_category?: string | null
          school_code?: string | null
          school_name: string
          school_type?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          commune?: string | null
          district?: string | null
          email?: string | null
          has_party_committee?: boolean | null
          id?: string
          international_school?: boolean | null
          minimum_quality_level?: boolean | null
          national_standard_level?: string | null
          phone_number?: string | null
          principal_name?: string | null
          principal_phone?: string | null
          quality_assurance?: string | null
          region?: string | null
          school_category?: string | null
          school_code?: string | null
          school_name?: string
          school_type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      staffs: {
        Row: {
          address: string | null
          code: string | null
          dob: number | null
          email: string | null
          employmentstatus: string | null
          ethnicity: string | null
          gender: string | null
          hometown: string | null
          id: string
          idcard: string | null
          name: string | null
          phonenumber: string | null
          pid: string | null
          religion: string | null
          school_code: string | null
          socialinsurancenumber: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          dob?: number | null
          email?: string | null
          employmentstatus?: string | null
          ethnicity?: string | null
          gender?: string | null
          hometown?: string | null
          id?: string
          idcard?: string | null
          name?: string | null
          phonenumber?: string | null
          pid?: string | null
          religion?: string | null
          school_code?: string | null
          socialinsurancenumber?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          dob?: number | null
          email?: string | null
          employmentstatus?: string | null
          ethnicity?: string | null
          gender?: string | null
          hometown?: string | null
          id?: string
          idcard?: string | null
          name?: string | null
          phonenumber?: string | null
          pid?: string | null
          religion?: string | null
          school_code?: string | null
          socialinsurancenumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staffs_code"
            columns: ["school_code"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_code"]
          },
        ]
      }
      students: {
        Row: {
          class: string | null
          code: string | null
          dob: string | null
          ethnicity: string | null
          fullname: string | null
          gender: string | null
          gradelevel: number | null
          id: string
          nationality: string | null
          permanentresidenceaddress: string | null
          school_code: string | null
          studentstatus: string | null
        }
        Insert: {
          class?: string | null
          code?: string | null
          dob?: string | null
          ethnicity?: string | null
          fullname?: string | null
          gender?: string | null
          gradelevel?: number | null
          id?: string
          nationality?: string | null
          permanentresidenceaddress?: string | null
          school_code?: string | null
          studentstatus?: string | null
        }
        Update: {
          class?: string | null
          code?: string | null
          dob?: string | null
          ethnicity?: string | null
          fullname?: string | null
          gender?: string | null
          gradelevel?: number | null
          id?: string
          nationality?: string | null
          permanentresidenceaddress?: string | null
          school_code?: string | null
          studentstatus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_school_code_fkey"
            columns: ["school_code"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_code"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          password: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          password: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          password?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
