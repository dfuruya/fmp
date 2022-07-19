import { supabase } from "../../../lib/initSupabase";

const updateIngredient = async (id, opts) => {
  const now = ((new Date()).toISOString()).toLocaleString('en-US')
  const { error } = await supabase
    .from("ingredients")
    .update({
      updated_at: now,
      ...opts,
    })
    .eq('id', id)

  if (!error) {
    return {}
  }

  return null
}

export default updateIngredient
