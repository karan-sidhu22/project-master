import { supabase } from '../lib/supabaseClient';

export const createUser = async (email: string, passwordHash: string) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password_hash: passwordHash }]);

    if (error) throw error;
    return data;
};

export const getUser = async (userId: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

export const updateUser = async (userId: string, updates: { email?: string, password_hash?: string }) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

    if (error) throw error;
    return data;
};

export const deleteUser = async (userId: string) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) throw error;
    return data;
};