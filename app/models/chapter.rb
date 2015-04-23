class Chapter < ActiveRecord::Base
  
  has_many :awsdocuments, dependent: :delete_all
  belongs_to :node
  belongs_to :user
  
  validates :title, :parent_id, presence: true
  
end
