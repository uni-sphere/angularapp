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
    if !self.position 
      brothers = Chapter.where(node_id: self.node_id, archived: false, parent_id: self.parent_id)
      if self.parent_id == 0
        last_position = -1
      elsif brothers.count == 0 and Chapter.find(self.parent_id).parent_id == 0
        last_position = 0
      elsif brothers.count == 0
        last_position = 0  
      else
        last_position = brothers.order('position DESC').first.position
      end
      self.position = last_position + 1
    end
  end
  
end
