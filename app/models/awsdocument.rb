class Awsdocument < ActiveRecord::Base
  
	belongs_to :chapter
  belongs_to :organization
  belongs_to :user
  
  mount_uploader :content, DocumentUploader
  
  after_save :fill_url
  before_save :add_position
  
  validates :title, :content, :organization_id, :user_id, :chapter_id, presence: true
  validate :check_size, on: :create
  
  def add_position
    if !self.position 
      brothers = Chapter.where(id: self.chapter_id, archived: false).first.awsdocuments
      if brothers.count == 0
        last_position = -1
      else
        last_position = brothers.order('position DESC').first.position
      end
      self.position = last_position + 1
    end
  end
  
  def check_size
    errors.add(:content, "too large") if self.content.file.size >= 20000000
  end
    
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
    end
  end
  
end