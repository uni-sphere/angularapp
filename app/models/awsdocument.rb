class Awsdocument < ActiveRecord::Base
  
	belongs_to :node
  
  mount_uploader :content, DocumentUploader
  # validates :name, presence: true
  validates :content, presence: true
  
  def self.find_unarchived(id)
    find_by(id: id, archived: false)
  end
  
  def archive
    self.archived = true
    self.save
  end
  
  def unarchive
    self.archived = false
    self.save
  end
  
end