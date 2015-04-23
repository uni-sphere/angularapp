require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe ReportsController do
  describe 'Report' do
    
    before do
      Organization.create!(name: 'organization_name')
      Organization.last.reports.create
      @report = Report.last
    end

    it 'has its views attribute incremented' do
      @report.increase_views
      expect( @report.views ).to match 1
    end
    
  end
end