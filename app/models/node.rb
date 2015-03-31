class Node < ActiveRecord::Base
  
	belongs_to :organization
  
  has_many :chapters
  
  validates :name, presence: true
  
end