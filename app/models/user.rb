class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  
  require 'bcrypt'
  
  has_many :chapters
  
  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates :email, format: { with: email_regex }
  validates :email , presence: true, uniqueness: true
  
  def self.send_activity_reports
    self.where(activity_reports: true).each do |user|
      UserMailer.activity_email(user).deliver
    end
  end
  
end