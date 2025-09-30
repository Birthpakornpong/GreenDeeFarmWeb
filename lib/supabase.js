// lib/supabase.js - Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations for users
export const userOperations = {
  // สร้างผู้ใช้ใหม่
  async createUser(userData) {
    try {
      const { username, email, password, full_name, phone, address } = userData;
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username,
            email,
            password, // ในการใช้จริงควร hash password ก่อน
            full_name,
            phone,
            address
          }
        ])
        .select();

      if (error) {
        console.error('❌ Create user error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ User created successfully:', data);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('❌ Create user exception:', error);
      return { success: false, error: error.message };
    }
  },

  // ค้นหาผู้ใช้ด้วย username
  async findUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Find user error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      console.error('❌ Find user exception:', error);
      return { success: false, error: error.message };
    }
  },

  // ค้นหาผู้ใช้ด้วย email
  async findUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Find user by email error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      console.error('❌ Find user by email exception:', error);
      return { success: false, error: error.message };
    }
  },

  // ค้นหาผู้ใช้ด้วย ID
  async findUserById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Find user by ID error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      console.error('❌ Find user by ID exception:', error);
      return { success: false, error: error.message };
    }
  },

  // อัปเดตข้อมูลผู้ใช้
  async updateUser(id, userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Update user error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('❌ Update user exception:', error);
      return { success: false, error: error.message };
    }
  }
};

// Test connection function
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('Config check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlLength: supabaseUrl?.length,
      keyLength: supabaseAnonKey?.length
    });

    // Test 1: Basic connection with a simple query that should always work
    console.log('📡 Testing basic connection...');
    
    // Try to get basic info from Supabase (this doesn't require any tables)
    const { data: connectionData, error: connectionError } = await supabase
      .from('nonexistent_table')
      .select('*')
      .limit(1);

    // Expected error for non-existent table, but connection should work
    if (connectionError && connectionError.code !== '42P01') {
      console.error('❌ Basic connection failed:', connectionError);
      return { 
        success: false, 
        error: connectionError.message || 'Unknown connection error',
        code: connectionError.code,
        details: connectionError.details,
        hint: connectionError.hint
      };
    }

    console.log('✅ Basic connection successful');

    // Test 2: Check if users table exists
    console.log('📋 Checking users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact', head: true });

    return { 
      success: true, 
      message: 'Connected to Supabase successfully',
      config: {
        url: supabaseUrl,
        hasKey: !!supabaseAnonKey
      },
      tableStatus: {
        usersTableExists: !usersError,
        usersError: usersError?.message || null,
        usersErrorCode: usersError?.code || null
      }
    };

  } catch (error) {
    console.error('❌ Supabase connection exception:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown exception',
      stack: error.stack
    };
  }
}