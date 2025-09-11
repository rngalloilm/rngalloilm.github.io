-------------
-- % Counties
-------------

-- %% Only counties with parks

SELECT cty_id, cty_name
FROM county
  JOIN park_county ON pct_cty_id=cty_id
GROUP BY cty_id
ORDER BY cty_id


-- %% Only counties without parks

SELECT cty_id, cty_name, pct_cty_id
FROM county
 LEFT JOIN park_county ON pct_cty_id=cty_id
WHERE pct_cty_id IS NULL
ORDER BY cty_id

-- %% County with the most parks

SELECT cty_id, cty_name
FROM county
  JOIN park_county ON pct_cty_id=cty_id
GROUP BY cty_id
ORDER BY COUNT(cty_id) DESC
LIMIT 1

-- %% Counties with at least 3 parks

SELECT cty_id, cty_name
FROM county
  JOIN park_county ON pct_cty_id=cty_id
GROUP BY cty_id
HAVING COUNT(cty_id) >= 3
ORDER BY cty_id


----------
-- % Parks
----------

-- %% All parks in counties that start with a “W”

SELECT park.* FROM park
 JOIN park_county ON pct_par_id=par_id
 JOIN county ON pct_cty_id=cty_id
WHERE cty_name LIKE "W%"
GROUP BY par_id

