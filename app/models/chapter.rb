class Chapter < ActiveRecord::Base
  
	has_many :awsdocuments, dependent: :delete_all
  belongs_to :node
  
  validates :title, :parent_id, presence: true
  
end
