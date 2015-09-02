class Node < ActiveRecord::Base
  
	belongs_to :organization
  belongs_to :user
  
  has_many :chapters
  has_many :reports
  
  validates :name, :parent_id, :user_id, presence: true
  
  def self.create_reports
    self.all.each do |node|
      if node.reports.last.nil?
        node.reports.create if node.chapters.count > 2
      else
        node.reports.create if node.chapters.count > 2 and Time.now - node.reports.last.created_at < 7.days and Time.now - node.reports.last.created_at > 6.days
      end
    end
  end
  
  def archive
    self.archived = true
    self.save
  end
  
end