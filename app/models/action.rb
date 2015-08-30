class Action < ActiveRecord::Base

  belongs_to :organization
  belongs_to :user
  
  validates :user_id, :organization_id , presence: true

  before_save :add_params
  
  def add_params
    self.organization_id = @current_organization.id
    self.user_id = current_user.id
    self.user = current_user.email
  end
  
end
