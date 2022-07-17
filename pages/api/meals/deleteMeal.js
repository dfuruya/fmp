import { supabase } from "../../../lib/initSupabase";

const deleteMeal = async (id) => {
  const { error } = await supabase
    .from("meals")
    .delete({ returning: "minimal" })
    .match({ id });

  if (!error) {
    return {};
  }

  return null
}

export default deleteMeal
