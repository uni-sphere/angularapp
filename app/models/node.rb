class Node < ActiveRecord::Base
  
	belongs_to :organization
  
  has_many :chapters, dependent: :delete_all
  has_many :reports
  
  validates :name, presence: true
  
end