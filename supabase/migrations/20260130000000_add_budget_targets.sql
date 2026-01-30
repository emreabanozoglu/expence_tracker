-- Add budget target columns to user_settings table
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS expense_target numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS saving_target numeric DEFAULT NULL;

COMMENT ON COLUMN user_settings.expense_target IS 'Monthly expense budget target';
COMMENT ON COLUMN user_settings.saving_target IS 'Monthly saving goal target';
