class Awsdocument < ActiveRecord::Base
  
	belongs_to :chapter
  belongs_to :organization
  
  mount_uploader :content, DocumentUploader
  after_save :fill_url
  
  validates :title, :content, :organization_id, presence: true
  
  def fill_url
    update_column(:url, self.content.file.url)
  end
  
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
  
  def self.refresh_links
    self.where(archived: false).each do |document|
      document.update(url: document.content.file.authenticated_url)
      logger.info document.title
    end
  end
  
end