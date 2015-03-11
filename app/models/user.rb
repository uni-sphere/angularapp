class User < ActiveRecord::Base
  
	has_and_belongs_to_many :nodes
	has_and_belongs_to_many :organizations
	has_many :awsdocuments
  
  validates :login, presence: true
  
end