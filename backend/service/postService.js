import pool from "../config/db.js";

export const createLostPostService = async (rollno, title, location, description, image_url, category_id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert into the `item` table
    const itemQuery = `
      INSERT INTO item (category_id, image_url, description, title, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING item_id
    `;
    const itemResult = await client.query(itemQuery, [category_id, image_url, description, title, location]);
    const itemId = itemResult.rows[0].item_id;

    // Insert into the `lostpost` table
    const lostPostQuery = `
      INSERT INTO lostpost (rollno, created_at, item_id)
      VALUES ($1, NOW(), $2)
      RETURNING *
    `;
    const lostPostResult = await client.query(lostPostQuery, [rollno, itemId]);

    await client.query("COMMIT");
    return lostPostResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating lost post:", error);
    throw new Error("Failed to create lost post");
  } finally {
    client.release();
  }
};

export const getLostPostService = async (postId) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM lostpost
      INNER JOIN item ON lostpost.item_id = item.item_id
      WHERE lostpost.lpost_id = $1
    `;
    const result = await client.query(query, [postId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching lost post:", error);
    throw new Error("Failed to fetch lost post");
  } finally {
    client.release();
  }
};

export const updateLostPostService = async (postId, title, location, description, image_url, category_id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const updateItemQuery = `
      UPDATE item
      SET title = $1, location = $2, description = $3, image_url = $4, category_id = $5
      WHERE item_id = (SELECT item_id FROM lostpost WHERE lpost_id = $6)
    `;
    await client.query(updateItemQuery, [title, location, description, image_url, category_id, postId]);

    await client.query("COMMIT");
    return { message: "Lost post updated successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating lost post:", error);
    throw new Error("Failed to update lost post");
  } finally {
    client.release();
  }
};

export const deleteLostPostService = async (postId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const deleteLostPostQuery = `
      DELETE FROM lostpost WHERE lpost_id = $1
    `;
    await client.query(deleteLostPostQuery, [postId]);

    const deleteItemQuery = `
      DELETE FROM item WHERE item_id = (SELECT item_id FROM lostpost WHERE lpost_id = $1)
    `;
    await client.query(deleteItemQuery, [postId]);

    await client.query("COMMIT");
    return { message: "Lost post deleted successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting lost post:", error);
    throw new Error("Failed to delete lost post");
  } finally {
    client.release();
  }
};

export const createFoundPostService = async (rollno, title, location, description, image_url, category_id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert into the `item` table
    const itemQuery = `
      INSERT INTO item (category_id, image_url, description, title, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING item_id
    `;
    const itemResult = await client.query(itemQuery, [category_id, image_url, description, title, location]);
    const itemId = itemResult.rows[0].item_id;

    // Insert into the `foundpost` table
    const foundPostQuery = `
      INSERT INTO foundpost (rollno, created_at, item_id)
      VALUES ($1, NOW(), $2)
      RETURNING *
    `;
    const foundPostResult = await client.query(foundPostQuery, [rollno, itemId]);

    await client.query("COMMIT");
    return foundPostResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating found post:", error);
    throw new Error("Failed to create found post");
  } finally {
    client.release();
  }
};


export const getFoundPostService = async (postId) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM foundpost
      INNER JOIN item ON foundpost.item_id = item.item_id
      WHERE foundpost.f_post_id = $1
    `;
    const result = await client.query(query, [postId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching found post:", error);
    throw new Error("Failed to fetch found post");
  } finally {
    client.release();
  }
};

export const updateFoundPostService = async (postId, title, location, description, image_url, category_id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const updateItemQuery = `
      UPDATE item
      SET title = $1, location = $2, description = $3, image_url = $4, category_id = $5
      WHERE item_id = (SELECT item_id FROM foundpost WHERE f_post_id = $6)
    `;
    await client.query(updateItemQuery, [title, location, description, image_url, category_id, postId]);

    await client.query("COMMIT");
    return { message: "Found post updated successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating found post:", error);
    throw new Error("Failed to update found post");
  } finally {
    client.release();
  }
};

export const deleteFoundPostService = async (postId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const deleteFoundPostQuery = `
      DELETE FROM foundpost WHERE f_post_id = $1
    `;
    await client.query(deleteFoundPostQuery, [postId]);

    const deleteItemQuery = `
      DELETE FROM item WHERE item_id = (SELECT item_id FROM foundpost WHERE f_post_id = $1)
    `;
    await client.query(deleteItemQuery, [postId]);

    await client.query("COMMIT");
    return { message: "Found post deleted successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting found post:", error);
    throw new Error("Failed to delete found post");
  } finally {
    client.release();
  }
};