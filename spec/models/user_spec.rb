require 'rails_helper'

RSpec.describe User, type: :model do
  context 'when defining the model' do
    it { is_expected.to validate_presence_of :password }
    it { is_expected.to validate_presence_of :email }
  end
end
