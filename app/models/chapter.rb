class Chapter < ActiveRecord::Base
  
	has_many :awsdocuments
  belongs_to :node
  
  validates :name, :parent_id, presence: true
  
end
