class Node < ActiveRecord::Base

  include BCrypt
  
  belongs_to :organization
  belongs_to :user

  has_many :chapters
  has_many :reports

  validates :name, :parent_id, :user_id, presence: true
  
  before_save :set_superadmin
  
  def set_superadmin
    self.superadmin = true if User.find(self.user_id).superadmin
  end
  
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

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    password = Password.create(new_password)
    self.password_hash = password
  end
end
