class User < ActiveRecord::Base
  
  belongs_to :organization
  
  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates :access, :email, presence: true
  validates :email, format: { with: email_regex }, uniqueness: { case_sensitive: false }
  
  before_save :set_admin_access
  
  private
  
  def set_admin_access
    return if self.access.present?
    self.access = generate_admin_access
  end
  
  def generate_admin_access
    loop do
      access = SecureRandom.hex
      break access unless self.class.exists?(access: access)
    end
  end
  
end