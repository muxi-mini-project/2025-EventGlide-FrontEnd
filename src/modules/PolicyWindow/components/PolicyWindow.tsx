import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import './style.scss';

const PolicyWindow: React.FC<{ setShowPolicyWindow: (show: boolean) => void }> = memo(
  ({ ...props }) => {
    return (
      <View className="policy-window">
        <View className="policy-window-background"></View>
        <View className="policy-window-container">
          <View className="policy-window-close" onClick={() => props.setShowPolicyWindow(false)}>
            ×
          </View>
          <View className="policy-window-header">校灵通隐私政策</View>
          <View className="policy-window-gapline1"></View>
          <View className="policy-window-content">
            <Text>
              作为华中师范大学学生自主运营的互联网技术团队，木犀一直高度重视隐私保护、郑重对待相应责任，并已将隐私保护的要求融入日常业务活动流程。
              希望您仔细阅读本条例，详细了解我们对信息的收集、使用方式，以便您更好地了解我们的服务并作出适当的选择。
              若您使用木犀课栈的服务，即表示您认同我们在本条例中所述内容。
            </Text>
            <View className="policy-window-content-section">
              <Text style={{ fontWeight: 'bold' }}>我们收集的信息</Text>
            </View>
            <Text>
              我们根据合法、正当、必要的原则，仅收集实现产品功能所必要的信息，并将竭力通过有效的信息安全技术及管理流程，防止您的信息泄露、损毁、丢失。
            </Text>
            <View className="policy-window-content-section">
              <Text style={{ fontWeight: 'bold' }}>1. 您在使用我们服务时主动提供的信息</Text>
            </View>
            <Text>
              您在登录时填写的信息。校灵通将采用华中师范大学一站式门户的账号密码进行登录，以协助您获取校园活动信息。
              您在使用服务时填写的信息，例如您上传的头像。
              我们的部分服务可能需要您提供特定的个人敏感信息来实现特定功能。
              若您选择不提供该类信息，则可能无法正常使用服务中的特定功能，但不影响您使用服务中的其他功能。
            </Text>
            <View className="policy-window-content-section">
              <Text style={{ fontWeight: 'bold' }}>2. 我们在您使用服务时获取的信息</Text>
            </View>
            <Text>
              当您使用我们的服务时，我们可能会存储服务日志信息，例如搜索、查看的信息、服务故障信息等。
            </Text>
            <View className="policy-window-content-section">
              <Text style={{ fontWeight: 'bold' }}>3. 其他相关信息</Text>
            </View>
            <Text>
              其他用户分享的信息中含有您的信息，例如其他用户分享的截图中可能包含您的信息。
              从第三方合作伙伴获取的信息，例如您使用QQ授权登录时，我们会获得您登录的名称、登录时间，方便您进行授权管理。
            </Text>
            <View className="policy-window-content-section">
              <Text style={{ fontWeight: 'bold' }}>我们如何使用收集的信息</Text>
            </View>
            <Text>
              向您提供服务；产品开发和服务优化；确保服务的安全，帮助我们更好地了解应用程序的运行情况。
            </Text>
            <View className="policy-window-content-section">
              <Text style={{ fontWeight: 'bold' }}>您分享的信息</Text>
            </View>
            <Text>
              您可以通过我们的服务与好友分享相关课程或评价信息。请注意，这其中可能包含您的个人身份信息，请谨慎考虑披露。
            </Text>
            <View className="policy-window-content-section">
              <Text style={{ fontWeight: 'bold' }}>联系我们</Text>
            </View>
            <Text>如您对本条例或其他相关事宜有疑问，请通过QQ群: ********* 与我们联系。</Text>
          </View>
        </View>
      </View>
    );
  }
);

export default PolicyWindow;
