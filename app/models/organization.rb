class Organization < ActiveRecord::Base
  
	has_many :nodes
  
  validates :name, presence: true
  validates :subdomain, uniqueness: true
  
end