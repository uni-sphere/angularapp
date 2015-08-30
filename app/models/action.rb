class Action < ActiveRecord::Base
  
  validates :user_id, :object_id, :organization_id, :user, :object, :name, :object_type, presence: true
  
end
