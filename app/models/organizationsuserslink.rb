class Organizationsuserslink < ActiveRecord::Base

  belongs_to :organization
  belongs_to :user
  
  validates :user_id, presence: true
  
end