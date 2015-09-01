class Node < ActiveRecord::Base
  
  include BCrypt
  
	belongs_to :organization
  belongs_to :user
  
  has_many :chapters
  has_many :reports
  
  validates :name, :parent_id, :user_id, presence: true
  
  def self.create_reports
    self.all.each do |node|
      node.reports.create if node.chapters.count > 2
    end
  end
  
  def archive
    self.archived = true
    self.save
  end
  
  def password
    @password ||= Password.new(password_hash)
  end
    
end