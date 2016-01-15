class Assignment < ActiveRecord::Base
  
  belongs_to :node
  belongs_to :user
  belongs_to :organization

  has_many :handins
  
end
