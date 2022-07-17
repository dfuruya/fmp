import { supabase } from "../../../lib/initSupabase";

const updateIngredient = async (id, in_stock) => {
  const now = ((new Date()).toISOString()).toLocaleString('en-US')
  const { error } = await supabase
    .from("ingredients")
    .update({ in_stock, updated_at: now })
    .eq('id', id);

  if (!error) {
    return {};
  }

  return null
}

export default updateIngredient
