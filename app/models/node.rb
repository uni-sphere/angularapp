class Node < ActiveRecord::Base

  include BCrypt

  belongs_to :organization
  belongs_to :user

  has_many :chapters
  has_many :reports

  validates :name, :parent_id, :user_id, presence: true

  before_save :set_superadmin, :add_position
  
  def add_position
    if !self.position and self.parent_id != 0
      brothers = Node.where(parent_id: self.parent_id, archived: false)
      logger.info " --------------------- "
      logger.info brothers
      logger.info brothers.count
      logger.info " --------------------- "
      if brothers.count == 0
        last_position = 0  
      else
        last_position = brothers.order('position DESC').first.position
      end
      self.position = last_position + 1
    end
  end
  
  def set_superadmin
    self.superadmin = true if User.find(self.user_id).superadmin
  end

  def self.create_reports
    # self.where(archived: false).each do |node|
    #   # if node.reports.count != 0
    #   node.reports.create if node.chapters.where(archived: false).count > 0 and Time.now - node.reports.last.created_at >= 7.days
    #   # end
    # end
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
