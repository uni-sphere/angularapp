class Chapter < ActiveRecord::Base
  
  include BCrypt
  
  has_many :awsdocuments
  belongs_to :node
  belongs_to :user
  
  validates :title, :parent_id, presence: true
  
  def archive
    self.archived = true
    self.save
  end
  
end
