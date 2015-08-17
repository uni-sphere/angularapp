class Node < ActiveRecord::Base
  
	belongs_to :organization
  belongs_to :user
  
  has_many :chapters, dependent: :delete_all
  has_many :reports
  
  validates :name, :parent_id, :user_id, presence: true
  
  def self.create_reports
    self.all.each do |node|
      node.reports.create if node.chapters.count > 2
    end
  end
  
end