class Node < ActiveRecord::Base
  
	belongs_to :organization
  
  has_many :chapters, dependent: :delete_all
  
  validates :name, presence: true
  
end