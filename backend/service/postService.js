import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import pool from "../config/db.js";

// if flag is true we send verified posts else unverified posts
export const getLostPostService = async (flag) => {
  const client = await pool.connect();
  let is_verified
  if (flag) {
    is_verified = true
  }
  else {
    is_verified = false
  }
  try {
    const query = `
    SELECT lp.lpost_id, lp.rollno, lp.created_at, i.item_id, i.title, i.description, i.image_url, i.location, c.category
FROM lostpost lp
JOIN item i ON lp.item_id = i.item_id
JOIN category c ON i.category_id = c.category_id
where is_verified=$1
ORDER BY lp.created_at DESC
    `;
    const result = await client.query(query, [is_verified]);
    return result.rows;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to fetch lost posts");
  } finally {
    client.release();
  }
};

export const getAdminPostsService = async () => {
  try {
    const query = `
  SELECT 
      'l' AS post_type,
      lp.lpost_id AS post_id,
      i.image_url,
      i.title,
      i.description,
      i.location
  FROM 
      lostpost lp
  JOIN 
      item i ON lp.item_id = i.item_id
  WHERE 
      lp.is_verified = false

  UNION ALL

  SELECT 
      'f' AS post_type,
      fp.f_post_id AS post_id,
      i.image_url,
      i.title,
      i.description,
      i.location
  FROM 
      foundpost fp
  JOIN 
      item i ON fp.item_id = i.item_id
  WHERE 
      fp.is_verified = false
`;
    const result = await pool.query(query)
    return result.rows
  }
  catch (error) {
    console.log(error.message)
    throw new Error(error.message)
  }
}

// if flag is true we send verified posts else unverified posts
export const getFoundPostService = async (flag) => {
  const client = await pool.connect();
  let is_verified
  if (flag) {
    is_verified = true
  }
  else {
    is_verified = false
  }
  try {
    const query = `
     SELECT fp.f_post_id, fp.rollno, fp.created_at, i.item_id, i.title, i.description, i.image_url, i.location, c.category
FROM foundpost fp
JOIN item i ON fp.item_id = i.item_id
JOIN category c ON i.category_id = c.category_id
where is_verified=$1
ORDER BY fp.created_at DESC
    `;
    const result = await client.query(query, [is_verified]);
    return result.rows;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to fetch found posts");
  } finally {
    client.release();
  }
};
// Missing function that should be added to retrieve the image URL
export const getImageUrlLostPost = async (postId) => {
  try {
    const query = `
      SELECT i.image_url
      FROM item i
      JOIN lostpost lp ON i.item_id = lp.item_id
      WHERE lp.lpost_id = $1
    `;

    const result = await pool.query(query, [postId]);

    if (result.rows.length === 0 || !result.rows[0].image_url) {
      console.warn("No image URL found for post ID:", postId);
      return null;
    }

    return result.rows[0].image_url;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
};

const getImageUrlFoundPost = async (postID) => {
  try {
    const query = `
      SELECT i.image_url
      FROM item i
      JOIN foundpost fp ON i.item_id = fp.item_id
      WHERE fp.fpost_id = $1
    `;

    const result = await pool.query(query, [postId]);

    if (result.rows.length === 0 || !result.rows[0].image_url) {
      console.warn("No image URL found for post ID:", postId);
      return null;
    }

    return result.rows[0].image_url;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
};


export const createLostPostService = async (rollno, title, location, description, image, category_id, campusID) => {
  const client = await pool.connect();
  try {
    let image_url = ""
    if (image) {
      image_url = await uploadToCloudinary(image)
    }
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
      INSERT INTO lostpost (rollno, created_at, item_id, "campusID")
      VALUES ($1, NOW(), $2, $3)
      RETURNING *
    `;
    const lostPostResult = await client.query(lostPostQuery, [rollno, itemId, campusID]);

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


export const updateLostPostService = async (post_id) => {
  try {

    const query = "UPDATE lostpost SET is_verified = true WHERE lpost_id = $1"
    await pool.query(query, [post_id])
    return { message: "Lost post updated successfully" };
  } catch (error) {
    console.error("Error updating found post:", error);
    throw new Error("Failed to update found post");
  }
};

// Improved deleteLostPostService
export const deleteLostPostService = async (postId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get the image URL first
    const img_url = await getImageUrlLostPost(postId);
    console.log("Image URL for deletion:", img_url);

    // Try to delete from Cloudinary, but continue even if it fails
    if (img_url) {
      const cloudinaryResult = await deleteFromCloudinary(img_url);
      console.log("Cloudinary deletion result:", cloudinaryResult);
    }

    // Delete the post from the database
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

export const createFoundPostService = async (rollno, title, location, description, image, category_id, campusID) => {
  const client = await pool.connect();
  try {
    let image_url = ""
    if (image) {
      image_url = await uploadToCloudinary(image)
    }
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
      INSERT INTO foundpost (rollno, created_at, item_id,"campusID")
      VALUES ($1, NOW(), $2, $3)
      RETURNING *
    `;
    const foundPostResult = await client.query(foundPostQuery, [rollno, itemId, campusID]);

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


export const updateFoundPostService = async (post_id) => {
  try {

    const query = "UPDATE foundpost SET is_verified = true WHERE f_post_id = $1"
    await pool.query(query, [post_id])
    return { message: "Found post updated successfully" };
  } catch (error) {
    console.error("Error updating found post:", error);
    throw new Error("Failed to update found post");
  }
};

export const deleteFoundPostService = async (postId) => {
  try {
    let img_url = await getImageUrlFoundPost(postId)
    if (img_url) {
      await deleteFromCloudinary(img_url)
    }
    const deleteItemQuery = `
      DELETE FROM item WHERE item_id = (SELECT item_id FROM foundpost WHERE f_post_id = $1)
    `;
    await pool.query(deleteItemQuery, [postId])
    return { message: "found post deleted successfully" };
  } catch (error) {
    console.error("Error deleting found post:", error);
    throw new Error("Failed to delete found post");
  }
};

export const getPostDataService = async () => {
  try {
    const getAllVerifiedPostsQuery = `
  SELECT
    lp.lpost_id AS id,
    lp."campusID",
    'Lost' AS type,
    i.title,
    i.category_id,
    i.description,
    i.location,
    to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
    i.image_url AS image,
    json_build_object(
      'name', u.name,
      'rollNumber', u.rollno,
      'avatar', u.image_url
    ) AS user,
    COALESCE(json_agg(
      json_build_object(
        'id', lc.l_comment_id,
        'text', lc.comment,
        'date', to_char(lc.created_at, 'YYYY-MM-DD HH24:MI:SS'),
        'user', json_build_object(
          'name', cu.name,
          'avatar', cu.image_url
        )
      )
    ) FILTER (WHERE lc.l_comment_id IS NOT NULL), '[]') AS comments
  FROM lostpost lp
  JOIN "User" u ON lp.rollno = u.rollno
  JOIN item i ON lp.item_id = i.item_id
  LEFT JOIN lostpostcomment lc ON lc.l_post_id = lp.lpost_id AND lc.is_verified = true
  LEFT JOIN "User" cu ON lc.rollno = cu.rollno
  WHERE lp.is_verified = true
  GROUP BY lp.lpost_id, lp."campusID", i.title, i.description, i.location, i.image_url,i.category_id, lp.created_at, u.name, u.rollno, u.image_url

  UNION ALL

  SELECT
    fp.f_post_id AS id,
    fp."campusID",
    'Found' AS type,
    i.title,
    i.category_id,
    i.description,
    i.location,
    to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
    i.image_url AS image,
    json_build_object(
      'name', u.name,
      'rollNumber', u.rollno,
      'avatar', u.image_url
    ) AS user,
    COALESCE(json_agg(
      json_build_object(
        'id', fc.f_comment_id,
        'text', fc.comment,
        'date', to_char(fc.created_at, 'YYYY-MM-DD HH24:MI:SS'),
        'user', json_build_object(
          'name', cu.name,
          'avatar', cu.image_url
        )
      )
    ) FILTER (WHERE fc.f_comment_id IS NOT NULL), '[]') AS comments
  FROM foundpost fp
  JOIN "User" u ON fp.rollno = u.rollno
  JOIN item i ON fp.item_id = i.item_id
  LEFT JOIN foundpostcomment fc ON fc.f_post_id = fp.f_post_id AND fc.is_verified = true
  LEFT JOIN "User" cu ON fc.rollno = cu.rollno
  WHERE fp.is_verified = true
  GROUP BY fp.f_post_id, fp."campusID", i.title, i.description, i.location, i.image_url, i.category_id, fp.created_at, u.name, u.rollno, u.image_url

  ORDER BY date DESC;
`;

    const result = await pool.query(getAllVerifiedPostsQuery)
    return result.rows
  }
  catch (error) {
    console.log("error fetching post data" + error.message)
    throw new Error(error.message)
  }
}

export const getPostsByRollNoService = async (rollno) => {
  try {
    const getPostsQuery = `
      SELECT
        lp.lpost_id AS id,
        lp."campusID",
        'Lost' AS type,
        i.title,
        i.category_id,
        i.description,
        i.location,
        to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        lp.is_verified AS isVerified
      FROM lostpost lp
      JOIN item i ON lp.item_id = i.item_id
      WHERE lp.rollno = $1
      
      UNION ALL
      
      SELECT
        fp.f_post_id AS id,
        fp."campusID",
        'Found' AS type,
        i.title,
        i.category_id,
        i.description,
        i.location,
        to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        fp.is_verified AS isVerified
      FROM foundpost fp
      JOIN item i ON fp.item_id = i.item_id
      WHERE fp.rollno = $1
      
      ORDER BY date DESC
    `;

    const { rows } = await pool.query(getPostsQuery, [rollno]);
    return rows;
  } catch (error) {
    console.error("Error fetching posts by roll number:", error);
    throw new Error("Failed to fetch posts by roll number: " + error.message);
  }
};

export const getUnverifiedPostsByRollNoService = async (rollno) => {
  try {
    const query = `
      SELECT 
        'Lost' AS post_type,
        lp.lpost_id AS post_id,
        i.image_url,
        i.title,
        i.description,
        i.location,
        to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
        c.category
      FROM 
        lostpost lp
      JOIN 
        item i ON lp.item_id = i.item_id
      JOIN 
        category c ON i.category_id = c.category_id
      WHERE 
        lp.rollno = $1 AND lp.is_verified = false
        
      UNION ALL
      
      SELECT 
        'Found' AS post_type,
        fp.f_post_id AS post_id,
        i.image_url,
        i.title,
        i.description,
        i.location,
        to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
        c.category
      FROM 
        foundpost fp
      JOIN 
        item i ON fp.item_id = i.item_id
      JOIN 
        category c ON i.category_id = c.category_id
      WHERE 
        fp.rollno = $1 AND fp.is_verified = false
      
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [rollno]);
    return rows;
  } catch (error) {
    console.error("Error fetching unverified posts by roll number:", error);
    throw new Error("Failed to fetch unverified posts by roll number: " + error.message);
  }
};

export const getRecent6PostsService = async () => {
  try {
    const query = `
      SELECT
        lp.lpost_id AS id,
        lp."campusID",
        'Lost' AS type,
        i.title,
        i.description,
        i.location,
        to_char(lp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        c."campusName" AS campus,
        u.name AS userName
      FROM lostpost lp
      JOIN "User" u ON lp.rollno = u.rollno
      JOIN item i ON lp.item_id = i.item_id
      JOIN campus c ON lp."campusID" = c."campusID"
      WHERE lp.is_verified = true

      UNION ALL

      SELECT
        fp.f_post_id AS id,
        fp."campusID",
        'Found' AS type,
        i.title,
        i.description,
        i.location,
        to_char(fp.created_at, 'YYYY-MM-DD HH24:MI:SS') AS date,
        i.image_url AS image,
        c."campusName" AS campus,
        u.name AS userName
      FROM foundpost fp
      JOIN "User" u ON fp.rollno = u.rollno
      JOIN item i ON fp.item_id = i.item_id
      JOIN campus c ON fp."campusID" = c."campusID"
      WHERE fp.is_verified = true

      ORDER BY date DESC
      LIMIT 6
    `;

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching recent 6 posts:", error);
    throw new Error("Failed to fetch recent 6 posts: " + error.message);
  }
};

export const getStatisticsService = async () => {
  try {
    // Get total verified posts (lost + found)
    const totalPostsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM lostpost WHERE is_verified = true) +
        (SELECT COUNT(*) FROM foundpost WHERE is_verified = true) AS total_posts
    `;

    // Get total users
    const totalUsersQuery = `
      SELECT COUNT(*) AS total_users FROM "User"
    `;

    // Get total verified comments (lost + found)
    const totalCommentsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM lostpostcomment WHERE is_verified = true) +
        (SELECT COUNT(*) FROM foundpostcomment WHERE is_verified = true) AS total_comments
    `;

    const [postsResult, usersResult, commentsResult] = await Promise.all([
      pool.query(totalPostsQuery),
      pool.query(totalUsersQuery),
      pool.query(totalCommentsQuery)
    ]);

    return {
      totalPosts: parseInt(postsResult.rows[0].total_posts),
      totalUsers: parseInt(usersResult.rows[0].total_users),
      totalComments: parseInt(commentsResult.rows[0].total_comments)
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw new Error("Failed to fetch statistics: " + error.message);
  }
};
