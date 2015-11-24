class Chapter < ActiveRecord::Base
  
  include BCrypt
  
  has_many :awsdocuments
  belongs_to :node
  belongs_to :user
  
  validates :title, :parent_id, presence: true
  
  before_save :add_position
  
  def archive
    self.archived = true
    self.save
  end
  
  def add_position
    if current_node.chapters.count == 0
      last_position = 0
    else
      last_position = current_node.chapters.order('position DESC').first
    end
    self.position = last_position + 1
  end
  
end
