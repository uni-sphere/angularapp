class Awsdocument < ActiveRecord::Base
  
	belongs_to :user
	belongs_to :node
  
  validates :url, :key, presence: true
  
  def self.find_unarchived(id)
    find_by(id: id, archived: false)
  end
  
  def archive
    self.archive = true
    self.save
  end
  
end