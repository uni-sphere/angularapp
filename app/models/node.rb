class Node < ActiveRecord::Base
  
	belongs_to :organization
  
  has_many :chapters, dependent: :delete_all
  has_many :reports
  
  validates :name, presence: true
  
  def self.create_reports
    self.each do |node|
      node.reports.create if node.chapters.count > 2
    end
  end
  
end