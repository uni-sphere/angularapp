class Organization < ActiveRecord::Base
  
	has_many :nodes, dependent: :delete_all
  has_many :users
  
  validates :name, presence: true
  validates :subdomain, uniqueness: true
  
end