class User < ActiveRecord::Base
  
  belongs_to :organization
  
  before_save :set_admin_access
  
  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates :email, format: { with: email_regex }
  validates :access_alias, :email , presence: true
  
  private
  
  def set_admin_access
    self.access = generate_admin_access
  end
  
  def generate_admin_access
    loop do
      access = SecureRandom.hex
      break access unless User.exists?(access: access)
    end
  end
  
end