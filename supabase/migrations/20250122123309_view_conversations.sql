CREATE VIEW all_conversations AS
SELECT 
  id,
  teacher,
  student
FROM 
  conversations
UNION ALL
SELECT 
  id,
  teacher,
  student
FROM 
  conversation_requests;