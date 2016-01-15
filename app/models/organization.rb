class Organization < ActiveRecord::Base
  
  before_save :format_subdomain
  
  has_many :nodes
  has_many :organizationsuserslinks
  has_many :users, through: :organizationsuserslinks
  has_many :awsdocuments
  has_many :connexions
  has_many :handins
  has_many :assignments
  
  validates :name, presence: true
  validates :subdomain, uniqueness: true
  validates_exclusion_of :subdomain, :in => ["api", "www", "sandbox", "admin", "doc"]
  
  def format_subdomain
    if self.website.include? 'www'
      self.subdomain = self.website.split('/')[2].split('.')[1]
    else
      self.subdomain = self.website.split('/')[2].split('.')[0]
    end
  end
  
end