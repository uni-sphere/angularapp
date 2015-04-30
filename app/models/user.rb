class User < ActiveRecord::Base
  
  require 'bcrypt'
  
  has_many :chapters
  
  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates :email, format: { with: email_regex }
  validates :email , presence: true
  
  def password
    @password ||= BCrypt::Password.new(password_hash)
  end
    
  def password=(new_password)
    @password = BCrypt::Password.create(new_password)
    self.password_hash = @password
  end
  
  def self.send_activity_reports
    self.where(activity_reports: true).each do |user|
      UserMailer.activity_email(user).deliver
    end
  end
  
end