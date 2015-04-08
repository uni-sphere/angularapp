class Organization < ActiveRecord::Base
  
	has_many :nodes
  has_many :users
  
  validates :name, presence: true
  validates :subdomain, uniqueness: true
  
end