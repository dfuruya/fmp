import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../../lib/initSupabase";

const createIngredient = async (params) => {
  const item = {
    id: typeof params.id === 'string' ? params.id : uuidv4(),
    name: params.name,
    ndb_no: typeof params.ndb_no === 'number' ? params.ndb_no : null,
    in_stock: !!params.in_stock,
    tags: params.tags,
  }

  if (item.name) {
    const { data } = await supabase
      .from("ingredients")
      .insert([item])
      .single();
      // .select("id, name, created, modified, description, tags, ingredients");
  
    return data
  }

  return null
}

export default createIngredient
