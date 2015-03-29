class Organization < ActiveRecord::Base
  
	has_many :nodes
  
  validates :name, presence: true
  
  before_create :set_organization_token
  
  private
  
  def set_organization_token
    return if self.token.present?
    self.token = generate_organization_token
  end
  
  def generate_organization_token
    loop do
      token = SecureRandom.hex
      break token unless self.class.exists?(token: token)
    end
  end
  
end